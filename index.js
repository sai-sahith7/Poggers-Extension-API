const express = require('express');
const app = express();
const admin = require('firebase-admin');
require('dotenv').config();
// enable CORS
const cors = require('cors');
app.use(cors({
    origin: '*'
}));


const port = 3000;

const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const database = admin.firestore();

app.get('/', (req, res) => {
    // res.send(database.collection('trash').get());
    // const collectionRef = database.collection('trash');
    // let allTrash = [];
    // collectionRef.get()
    //     .then(snapshot => {
    //         snapshot.forEach(doc => {
    //             allTrash.push({
    //                 "name": doc.data()['name'],
    //                 "quantity": doc.data()['quantity'],
    //                 "image": doc.data()['image']
    //             });
    //         });
    //         res.send(allTrash);
    //     })
    //     .catch(error => {
    //         console.error('Error reading data:', error);
    //     });
    res.send('API is up and running !!');
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const collectionRef = database.collection('trash');
    let allTrash = [];
    collectionRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const regex = new RegExp(doc.data()['name'], 'i');
                if (regex.test(query)) {
                    allTrash.push({
                        "name": doc.data()['name'],
                        "quantity": doc.data()['quantity'],
                        "image": doc.data()['image']
                    });
                }
            });
            res.json({ "data": allTrash });
        })
        .catch(error => {
            console.error('Error reading data:', error);
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});