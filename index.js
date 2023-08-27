const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const AWS = require('aws-sdk');
const uuid = require('uuid'); // For generating unique keys

app.use(fileUpload());

app.post('/upload', async (req, res) => {
    try {
        AWS.config.update({
            accessKeyId: "ATxybM6xPiWj97Rg68m1",
            secretAccessKey: "YcAsb48ZaKDvnyxEVvYT5s9dnYfWyShbwozjv8Mt",
            region: "us-east-1"
        });

        console.log('req.files:', req.files.data); // Log the files object
        
        if (!req.files || !req.files.data) {
            res.status(400).send({
                "response_code": 400,
                "response_message": 'No file uploaded'
            });
            return;
        }

        const s3 = new AWS.S3();
        const fileContent = Buffer.from(req.files.data.data, 'binary');
        const uniqueKey = uuid.v4(); // Generate a unique key for the S3 object

        const params = {
            Bucket: 'python-test-app',
            Key: uniqueKey, // Use the unique key
            Body: fileContent
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    "response_code": 500,
                    "response_message": 'Error uploading to S3',
                    "error": err
                });
            } else {
                res.send({
                    "response_code": 200,
                    "response_message": 'Success',
                    "response_data": data
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            "response_code": 500,
            "response_message": 'Server error',
            "error": error
        });
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
