var express = require('express');
var app = express();
app.use(express.static('assets'))

const port = process.env.PORT || 3000;

app.listen(port,);
app.set('view engine', 'ejs');

var fs = require("firebase-admin");
let serviceAccount;
if (process.env.GOOGLE_CREDENTIALS != null) {
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else {
    serviceAccount = require("./korean-food-merchandise-firebase-adminsdk-1f4td-0fdccc850c.json");
}
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
const itemColl = db.collection('items');

app.get('/', async function (req, res) {
    const items = await itemColl.get();
    let data = {
        url: req.url,
        itemData: items.docs,
    }
    res.render('pages/index', data);
});

app.get('/item/:itemid', async function (req, res) {
    try {
        console.log(req.params.itemid);

    } catch (e) {
    }
    const item_id = req.params.itemid;
    const item_ref = itemColl.doc(item_id);
    const doc = await item_ref.get();
    let itemData = doc.data();
    console.log(itemData);

    const invent_ref = itemColl.doc(item_id).collection('inventory')
    hist_array= []
    await invent_ref.get().then(subCol => {
        subCol.docs.forEach(element => {
            hist_array.push(element.data());
    })
    console.log('Inventory data:', hist_array)

    res.render('pages/item', {itemData, hist_array});
    })
});

