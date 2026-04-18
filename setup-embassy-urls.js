const admin = require('firebase-admin');

const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'muka-tenders'
});

const db = admin.firestore();

async function setupAllEmbassyUrls() {
  try {
    console.log('🌍 Adding ALL embassy websites...\n');

    const embassies = [
      { country: 'Brazil', url: 'https://br.usembassy.gov/procurement-and-contract-opportunities/#purchase' },
      { country: 'India - Mumbai', url: 'https://in.usembassy.gov/embassy-consulates-contract-solicitations/' },
      { country: 'Indonesia', url: 'https://id.usembassy.gov/invitation-for-bidding-jakarta/' },
      { country: 'Costa Rica', url: 'https://cr.usembassy.gov/business/#procurement' },
      { country: 'Namibia', url: 'https://na.usembassy.gov/business/' },
      { country: 'Liberia', url: 'https://lr.usembassy.gov/business/#opportunities' },
      { country: 'Cameroon', url: 'https://cm.usembassy.gov/business/#opportunities' },
      { country: 'Cameroon 2', url: 'https://cm.usembassy.gov/category/econ-opportunity/' },
      { country: 'India - Chennai', url: 'https://in.usembassy.gov/mandatory-requirements-for-all-solicitations-chennai/' },
      { country: 'Ecuador', url: 'https://ec.usembassy.gov/contract-and-solicitation-opportunities/' },
      { country: 'Vietnam', url: 'https://vn.usembassy.gov/business-opportunities-hanoi/' },
      { country: 'Germany', url: 'https://de.usembassy.gov/category/econ-opportunity/' },
      { country: 'Japan', url: 'https://jp.usembassy.gov/jobs/business-opportunities/' },
      { country: 'Mexico', url: 'https://mx.usembassy.gov/mexico-city-contract-and-procurement-opportunities/' },
      { country: 'Morocco', url: 'https://ma.usembassy.gov/procurement-opportunities/' },
      { country: 'Morocco 2', url: 'https://ma.usembassy.gov/procurement-opportunities/' },
      { country: 'Morocco 3', url: 'https://ma.usembassy.gov/business/#opportunities' },
      { country: 'Saudi Arabia', url: 'https://sa.usembassy.gov/procurement-solicitation-packages-riyadh/' },
      { country: 'South Africa', url: 'https://za.usembassy.gov/commercial-opportunities/' },
      { country: 'Turkey - Adana', url: 'https://tr.usembassy.gov/solicitations-and-contracts-for-the-u-s-consulate-adana/' },
      { country: 'Turkey - Istanbul', url: 'https://tr.usembassy.gov/solicitations-and-contracts-for-the-u-s-consulate-general-istanbul/#solicitations' },
      { country: 'France', url: 'https://fr.usembassy.gov/gso-contracting-and-procurement/' },
      { country: 'Angola', url: 'https://ao.usembassy.gov/business/commercial-opportunities/' },
      { country: 'Armenia', url: 'https://am.usembassy.gov/category/econ-opportunity/' },
      { country: 'Armenia 2', url: 'https://am.usembassy.gov/category/econ-opportunity/page/2/' },
      { country: 'Armenia 3', url: 'https://am.usembassy.gov/business/#opportunities' },
      { country: 'Bangladesh', url: 'https://bd.usembassy.gov/grants-and-procurement-opportunities/' },
      { country: 'Benin', url: 'https://bj.usembassy.gov/u-s-embassy-cotonou-bid-solicitations/' },
      { country: 'Bolivia', url: 'https://bo.usembassy.gov/request-for-quotations/' },
      { country: 'Kazakhstan', url: 'https://kz.usembassy.gov/astana/' },
      { country: 'Botswana', url: 'https://bw.usembassy.gov/business/' },
      { country: 'Botswana 2', url: 'https://bw.usembassy.gov/gso-procurement-opportunities/' },
      { country: 'Burma', url: 'https://mm.usembassy.gov/commercial-opportunities/' },
      { country: 'Burundi', url: 'https://bi.usembassy.gov/business/commercial-opportunities/' },
      { country: 'Burundi 2', url: 'https://bi.usembassy.gov/category/econ-opportunity/' },
      { country: 'Chile', url: 'https://cl.usembassy.gov/commercial-opportunities/' },
      { country: 'Chile 2', url: 'https://cl.usembassy.gov/business/#opportunities' },
      { country: 'Colombia', url: 'https://co.usembassy.gov/solicitation-contracting/' },
      { country: 'Djibouti', url: 'https://dj.usembassy.gov/procurement-acquisitions/' },
      { country: 'Egypt', url: 'https://eg.usembassy.gov/u-s-embassy-cairo/contract-solicitations/' },
      { country: 'Egypt 2', url: 'https://eg.usembassy.gov/commercial-opportunities/' },
      { country: 'Eritrea', url: 'https://er.usembassy.gov/business/#contract' },
      { country: 'El Salvador', url: 'https://sv.usembassy.gov/request-for-quotations/' },
      { country: 'Equatorial Guinea', url: 'https://gq.usembassy.gov/category/econ-opportunity/' },
      { country: 'Equatorial Guinea 2', url: 'https://gq.usembassy.gov/oportunidad-de-contrato/' },
      { country: 'Eswatini', url: 'https://sz.usembassy.gov/procurement-2/' },
      { country: 'Ethiopia', url: 'https://et.usembassy.gov/procurement-opportunities/' },
      { country: 'Georgia', url: 'https://ge.usembassy.gov/tenders/' },
      { country: 'Ghana', url: 'https://gh.usembassy.gov/business/contract-opportunities/' },
      { country: 'Ghana 2', url: 'https://gh.usembassy.gov/business/contract-opportunities/' },
      { country: 'Guinea', url: 'https://gn.usembassy.gov/tag/procurement-advertisements/' },
      { country: 'Guyana', url: 'https://gy.usembassy.gov/contract-solicitation-and-procurement/' },
      { country: 'Guyana 2', url: 'https://gy.usembassy.gov/business/#contract' },
      { country: 'Guyana 3', url: 'https://gy.usembassy.gov/contract-solicitation-and-procurement/' },
      { country: 'Israel', url: 'https://il.usembassy.gov/contract-solicitations/' },
      { country: 'Jamaica', url: 'https://jm.usembassy.gov/tag/procurement-opportunities/' },
      { country: 'Jordan', url: 'https://jo.usembassy.gov/category/econ-opportunity/' },
      { country: 'Kenya', url: 'https://ke.usembassy.gov/tag/request-for-proposals/' },
      { country: 'Kuwait', url: 'https://kw.usembassy.gov/contract-solicitations/' },
      { country: 'Lesotho', url: 'https://ls.usembassy.gov/commercial-opportunities/' },
      { country: 'Madagascar', url: 'https://mg.usembassy.gov/tag/commercial/' },
      { country: 'Madagascar 2', url: 'https://mg.usembassy.gov/business/' },
      { country: 'Lesotho 2', url: 'https://ls.usembassy.gov/category/econ-opportunity/' },
      { country: 'Malawi', url: 'https://mw.usembassy.gov/procurement-opportunities/' },
      { country: 'Mali', url: 'https://ml.usembassy.gov/requests-for-proposals/' },
      { country: 'Nepal', url: 'https://np.usembassy.gov/contract-grant-opportunities/' },
      { country: 'Nicaragua', url: 'https://ni.usembassy.gov/procurement-contracting/' },
      { country: 'Niger', url: 'https://ne.usembassy.gov/business/' },
      { country: 'Nigeria', url: 'https://ng.usembassy.gov/business' },
      { country: 'North Macedonia', url: 'https://mk.usembassy.gov/contract-solicitations/' },
      { country: 'Oman', url: 'https://om.usembassy.gov/contracting-opportunities-at-embassy/' },
      { country: 'Panama', url: 'https://pa.usembassy.gov/request-for-quotations/' },
      { country: 'Paraguay', url: 'https://py.usembassy.gov/commercial-opportunities/' },
      { country: 'Peru', url: 'https://pe.usembassy.gov/request-for-quotations/' },
      { country: 'Sri Lanka', url: 'https://lk.usembassy.gov/contracting-opportunities/' },
      { country: 'Tanzania', url: 'https://tz.usembassy.gov/contract-opportunities/' },
      { country: 'Thailand', url: 'https://th.usembassy.gov/gso-procurement-sales-opportunities/' },
      { country: 'Thailand 2', url: 'https://th.usembassy.gov/tag/rfq-bangkok/' },
      { country: 'Thailand 3', url: 'https://th.usembassy.gov/tag/rfq-chiang-mai/' },
      { country: 'Democratic Republic of Congo', url: 'https://cd.usembassy.gov/commercial-opportunities/' },
      { country: 'Dominican Republic', url: 'https://do.usembassy.gov/category/econ-opportunity/' },
      { country: 'Philippines', url: 'https://ph.usembassy.gov/local-contracts-and-procurement/' },
      { country: 'Togo', url: 'https://tg.usembassy.gov/business/#opp' },
      { country: 'Togo 2', url: 'https://tg.usembassy.gov/contract-opportunities/' },
      { country: 'Turkmenistan', url: 'https://tm.usembassy.gov/commercial-opportunities/' },
      { country: 'Turkmenistan 2', url: 'https://tm.usembassy.gov/contract-solicitations/' },
      { country: 'Uganda', url: 'https://ug.usembassy.gov/procurement-section/' },
      { country: 'Uganda 2', url: 'https://ug.usembassy.gov/tag/procurement-solicitations/' },
      { country: 'Ukraine', url: 'https://ua.usembassy.gov/commercial-and-contract-opportunities/#bids' },
      { country: 'Ukraine 2', url: 'https://ua.usembassy.gov/commercial-and-contract-opportunities/' },
      { country: 'Uruguay', url: 'https://uy.usembassy.gov/call-for-bids/' },
      { country: 'Uruguay 2', url: 'https://uy.usembassy.gov/category/econ-opportunity/' },
      { country: 'Uzbekistan', url: 'https://uz.usembassy.gov/procurement-and-contracting/' },
      { country: 'Zambia', url: 'https://zm.usembassy.gov/procurement-and-contracting-opportunities/' },
      { country: 'Zimbabwe', url: 'https://zw.usembassy.gov/request-for-various-solicitations/' },
      { country: 'Mauritius & Seychelles', url: 'https://mu.usembassy.gov/commercial-opportunities/' },
      { country: 'Pakistan - Karachi', url: 'https://pk.usembassy.gov/procurement-solicitations-karachi/' },
      { country: 'Pakistan', url: 'https://pk.usembassy.gov/procurement-solicitation-packages/' },
      { country: 'Serbia', url: 'https://rs.usembassy.gov/procurement-opportunities/' },
      { country: 'Barbados', url: 'https://bb.usembassy.gov/business-opportunities/' },
      { country: 'South Korea', url: 'https://kr.usembassy.gov/solicitation-notice/' },
      { country: 'Qatar', url: 'https://qa.usembassy.gov/contracting-opportunities/' },
      { country: 'Gabon', url: 'https://ga.usembassy.gov/business/#opportunities' },
      { country: 'Gabon 2', url: 'https://ga.usembassy.gov/business/#opportunities' },
      { country: 'Belize', url: 'https://bz.usembassy.gov/solicitation-opportunities/' },
      { country: 'Argentina', url: 'https://ar.usembassy.gov/general-services-office/' },
      { country: 'Mexico - Nogales', url: 'https://mx.usembassy.gov/nogales-contract-and-procurement-opportunities-2/' },
      { country: 'Mexico - Ciudad Juarez', url: 'https://mx.usembassy.gov/ciudad-juarez-contract-and-procurement-opportunities/' },
      { country: 'Mexico 3', url: 'https://mx.usembassy.gov/mexico-city-contract-and-procurement-opportunities/' },
      { country: 'Mexico - Business', url: 'https://mx.usembassy.gov/business/' },
      { country: 'Sweden', url: 'https://se.usembassy.gov/contract-solicitations/' },
      { country: 'Bangladesh - Business', url: 'https://bd.usembassy.gov/business/' },
      { country: 'Bangladesh 2', url: 'https://bd.usembassy.gov/grants-and-procurement-opportunities/#embassy' },
      { country: 'Haiti', url: 'https://ht.usembassy.gov/business/#opps' },
      { country: 'Haiti 2', url: 'https://ht.usembassy.gov/contract-opportunities/' },
      { country: 'Haiti 3', url: 'https://ht.usembassy.gov/commercial-opportunities/' },
      { country: 'Belgium', url: 'https://be.usembassy.gov/commercial-opportunities/' },
      { country: 'New Zealand', url: 'https://nz.usembassy.gov/business/commercial-opportunities-for-local-vendors/#opps' },
      { country: 'Estonia', url: 'https://ee.usembassy.gov/business/business-opportunities/#rfq' },
      { country: 'Germany - Frankfurt', url: 'https://de.usembassy.gov/frankfurt-contract-opportunities/' },
      { country: 'Germany - Munich', url: 'https://de.usembassy.gov/munich-solicitations-and-services/' },
      { country: 'Germany - Berlin', url: 'https://de.usembassy.gov/contract-opportunities-berlin/' },
      { country: 'Germany - Frankfurt 2', url: 'https://de.usembassy.gov/rpso-procurement-acquisitions/' },
      { country: 'Turkey - Ankara', url: 'https://tr.usembassy.gov/solicitations-and-contracts-for-the-u-s-embassy-in-ankara/' },
      { country: 'Saudi Arabia - Dhahran', url: 'https://sa.usembassy.gov/procurement-solicitation-packages-dhahran/' },
      { country: 'Cambodia', url: 'https://kh.usembassy.gov/business-opportunities/' },
      { country: 'Slovakia', url: 'https://sk.usembassy.gov/procurement/' },
      { country: 'Timor Leste', url: 'https://tl.usembassy.gov/business/#opportunities' },
      { country: 'Marshall Islands', url: 'https://mh.usembassy.gov/education/grants-and-opportunities/' },
      { country: 'Moldova', url: 'https://md.usembassy.gov/business/#opportunities' },
      { country: 'Cabo Verde', url: 'https://cv.usembassy.gov/business-opportunities/' },
      { country: 'Cyprus', url: 'https://cy.usembassy.gov/procurement-solicitations/' },
      { country: 'Brazil 2', url: 'https://br.usembassy.gov/procurement-and-contract-opportunities/' },
      { country: 'Mongolia', url: 'https://mn.usembassy.gov/commercial-and-contract-opportunities/' },
      { country: 'Honduras', url: 'https://hn.usembassy.gov/solicitations/' }
    ];

    let count = 0;
    for (const embassy of embassies) {
      await db.collection('embassy_websites').add({
        country: embassy.country,
        url: embassy.url,
        active: true,
        last_scraped: null,
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now()
      });
      count++;
      if (count % 10 === 0) console.log(`✅ Added ${count} websites...`);
    }

    console.log(`\n✨ Complete! Added ${embassies.length} embassy websites to Firestore`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAllEmbassyUrls();