const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const _ = require('lodash')
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('server is running...')
})

app.post('/sendotp', (req,res) => {
    var phoneno = _.get(req, ["body", "phoneno"]);

    console.log(phoneno)

    try {
        phoneno = String(phoneno)
        if(phoneno && phoneno.length == 10) {
            
            var data = JSON.stringify({
            "msisdn": phoneno,
            "sender": "SMSOTP"
            });

            var config = {
            method: 'post',
            url: 'https://www.havesms.com/api/otp/send',
            headers: { 
                'Authorization': 'Bearer { YOUR TOKEN }', 
                'Content-Type': 'application/json'
            },
            data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));

                if(response.data.error == false) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        Result: {
                            Description: response.data.description,
                            Ref: response.data.ref,
                            Transid: response.data.transaction_id,
                            EXP: response.data.expired_at
                        }
                    })
                }
                else {
                    return res.status(400).json({
                        RespCode: 400,
                        RespMessage: 'bad : Something is went wrong!',
                        Log: 3
                    })
                }

                
            })
            .catch(function (error) {
                console.log(error);
                return res.status(400).json({
                    RespCode: 400,
                    RespMessage: 'bad : Send otp fail',
                    Log: 2 
                })
            });
        }
        else {
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'bad : Invalid phone number',
                Log: 1 
            })
        }
    }
    catch(error) {
        console.log(error)
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

app.post('/verifyotp', (req,res) => {
    var phoneno = _.get(req, ["body", "phoneno"]);
    var otp = _.get(req, ["body", "otp"]);
    var transid = _.get(req, ["body", "transid"]);

    try {
        otp = String(otp);
        phoneno = String(phoneno);
        transid = String(transid);
        if(phoneno.length == 10 && otp.length == 6 && transid) {
            var data = JSON.stringify({
                "msisdn": phoneno,
                "otp": otp,
                "transaction_id": transid
            });

            var config = {
            method: 'post',
            url: 'https://www.havesms.com/api/otp/verify',
            headers: { 
                'Authorization': 'Bearer { YOUR TOKEN }', 
                'Content-Type': 'application/json'
            },
            data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                if(response.data.error == false) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        Result: 'ยืนยัน OTP สำเร็จ'
                    })
                }
                else {
                    return res.status(400).json({
                        RespCode: 400,
                        RespMessage: 'bad : Something is went wrong!',
                        Log: 3
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                return res.status(400).json({
                    RespCode: 400,
                    RespMessage: 'bad : Verify OTP fail',
                    Log: 2
                })
            });

        }
        else {
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'bad : Invalid request',
                Log: 1 
            })
        }
    }
    catch(error) {
        console.log(error)
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }

})


exports.module = app;
