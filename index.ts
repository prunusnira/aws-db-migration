import MariaLoader from "./marialoader";
import DynamoWriter from "./dynamowriter";
import express from 'express';

const app = express();
app.listen(8080, () => {

});

app.get('/', (req, res) => {
    const loader1 = new MariaLoader();
    const loader2 = new DynamoWriter();

    loader1.LoadList()
    .then((list) => {
        loader2.CreateMusic()
        .then(() => {
            loader2.InsertMusic(list);
        });
    });
    loader1.LoadLevel()
    .then((list) => {
        loader2.CreateLv()
        .then(() => {
            loader2.InsertLv(list);
        });
    });
});
