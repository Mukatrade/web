const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

admin.initializeApp();
const db = admin.firestore();

// Scraper triggered daily at 9 AM
exports.scrapeTenders = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    console.log('🔄 Starting Scraper Agent at', new Date().toISOString());

    try {
      // Get all active embassy websites
      const websitesSnapshot = await db.collection('embassy_websites')
        .where('active', '==', true)
        .get();

      console.log(`📋 Found ${websitesSnapshot.docs.length} active websites`);

      let newTendersFound = 0;

      for (const doc of websitesSnapshot.docs) {
        const website = doc.data();
        console.log(`\n🌍 Scraping: ${website.country}`);

        try {
          const response = await fetch(website.url, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const html = await response.text();
          const $ = cheerio.load(html);

          // Extract tender information (adjust selectors based on actual website structure)
          const tenders = [];
          
          // Look for common tender elements
          $('article, .tender, .solicitation, .rfq, .bid, .procurement').each((i, el) => {
            const $el = $(el);
            const title = $el.find('h1, h2, h3, .title').text().trim();
            const link = $el.find('a').attr('href');
            const dateText = $el.find('.date, time, .deadline').text().trim();

            if (title && link) {
              tenders.push({
                title,
                link: link.startsWith('http') ? link : new URL(link, website.url).href,
                dateText
              });
            }
          });

          console.log(`  Found ${tenders.length} potential tenders`);

          // Save new tenders to Firestore
          for (const tender of tenders) {
            const existingTender = await db.collection('tenders')
              .where('tender_url', '==', tender.link)
              .get();

            if (existingTender.empty) {
              await db.collection('tenders').add({
                internal_number: `TND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                timestamp: admin.firestore.Timestamp.now(),
                organization: website.country,
                location_country: website.country,
                rfq_number: `RFQ-${Date.now()}`,
                title: tender.title,
                tender_url: tender.link,
                items_requested: 0,
                status: 'sourcing',
                priority: 'green',
                agent_assigned: 'SCRAPER',
                assigned_to: 'info@mukatrade.com',
                due_date: admin.firestore.Timestamp.now(),
                created_at: admin.firestore.Timestamp.now(),
                updated_at: admin.firestore.Timestamp.now(),
                visibility: 'public'
              });

              newTendersFound++;
              console.log(`  ✅ Saved new tender: ${tender.title.substring(0, 50)}...`);

              // Log agent action
              await db.collection('agent_logs').add({
                agent_name: 'SCRAPER',
                action: 'TENDER_FOUND',
                status: 'success',
                details: `Found tender: ${tender.title} from ${website.country}`,
                timestamp: admin.firestore.Timestamp.now()
              });
            }
          }

          // Update last_scraped timestamp
          await db.collection('embassy_websites').doc(doc.id).update({
            last_scraped: admin.firestore.Timestamp.now()
          });

        } catch (error) {
          console.error(`  ❌ Error scraping ${website.country}:`, error.message);
          
          await db.collection('agent_logs').add({
            agent_name: 'SCRAPER',
            action: 'SCRAPE_ERROR',
            status: 'error',
            details: `Failed to scrape ${website.country}: ${error.message}`,
            timestamp: admin.firestore.Timestamp.now()
          });
        }
      }

      console.log(`\n✨ Scraper completed. Found ${newTendersFound} new tenders`);

      return null;
    } catch (error) {
      console.error('❌ Scraper Agent error:', error);
      return null;
    }
  });