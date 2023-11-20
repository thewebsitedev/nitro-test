/**
 * Basic express server for serving post data.
 */

var express = require('express');
var cors = require('cors');

const app = express();
const port = 3100;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/get-posts', (req, res, next) => {
    res.json([
        {
            "id": 1,
            "location": "San Francisco",
            "time": "1552657573",
            "author": "Happy User",
            "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
        },
        {
            "id": 2,
            "location": "San Francisco",
            "time": "1552571173",
            "author": "Happy User",
            "text": "The modern workplace is increasingly digital, and workflows are constantly evolving."
        },
        {
            "id": 3,
            "location": "San Francisco",
            "time": "1552571174",
            "author": "Happy Developer",
            "text": "Digital transformation isn't just a buzzword"
        },
        {
            "id": 4,
            "location": "Sydney",
            "time": "1552563973",
            "author": "Happy Developer",
            "text": "An expectation of digital efficiency has become the norm in our daily lives"
        },
        {
            "id": 5,
            "location": "Dublin",
            "time": "1553080742",
            "author": "Happy Manager",
            "text": "A modern PDF annotator that can accommodate all of the cooks in a very busy kitchen is what your employees really need."
        },
        {
            "id": 6,
            "location": "Dublin",
            "time": "1553099742",
            "author": "Happy Manager",
            "text": "An integrated productivity solution breaks information through barriers and allows workers to collaborate in real time."
        }
    ]);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})