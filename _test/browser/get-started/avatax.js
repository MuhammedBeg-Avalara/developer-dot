module.exports = {
    'baseURL': process.env.BASEURL ? process.env.BASEURL.replace(/\/$/, '') : 'http://localhost:4000',
    'waitTime': isNaN(parseInt(process.env.TIMEOUT, 10)) ? 5000 : parseInt(process.env.TIMEOUT, 10),
    'before': function() {
        /* eslint-disable no-console */
        console.log('WaitTime set to', this.waitTime);
        console.log('BaseURL set to', this.baseURL);
        /* eslint-enable no-console */
    },

    'Get Started: AvaTax (verify number of endpoints)': function(browser) {
        const expectedNumberOfApiEndpoints = 2;

        browser
            .maximizeWindow()
            .url(this.baseURL + '/avatax/get-started/')
            .waitForElementVisible('[data-reactroot]', this.waitTime)

            .elements('css selector', '[role=tab]', function(result) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(result.value.length, expectedNumberOfApiEndpoints, 'expected ' + expectedNumberOfApiEndpoints + ' endpoints, received ' + result.value.length);
                /* eslint-enable no-invalid-this */
            })
            .end();
    },
    'Get Started: AvaTax (verify tabs)': function(browser) {
        browser
            .maximizeWindow()
            .url(this.baseURL + '/avatax/get-started/')
            .waitForElementVisible('[data-reactroot]', this.waitTime)

            .waitForElementVisible('#ValidateanAddresstab', this.waitTime)
            .click('#ValidateanAddresstab')
            .getText('#ValidateanAddress .console-output-header+.code-snippet-plaintext', function(req) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(req.value, 'https://development.avalara.net/1.0/address/validate');
                /* eslint-enable no-invalid-this */
            })

            .waitForElementVisible('#CalculateTaxtab', this.waitTime)
            .click('#CalculateTaxtab')
            .getText('#CalculateTax .console-output-header+.code-snippet-plaintext', function(req) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(req.value, 'https://development.avalara.net/1.0/tax/get');
                /* eslint-enable no-invalid-this */
            })
            .end();
    },
    'Get Started: AvaTax (ValidateanAddress, fill sample data)': function(browser) {
        const expectedResponseValidateAnAddress = {
            Address: {
                County: 'KING',
                FipsCode: '5303363000',
                CarrierRoute: 'C005',
                PostNet: '981094607006',
                AddressType: 'S',
                Line1: '400 Broad St',
                City: 'Seattle',
                Region: 'WA',
                PostalCode: '98109-4607',
                Country: 'US'
            },
            ResultCode: 'Success'
        };

        browser
            .maximizeWindow()
            .url(this.baseURL + '/avatax/get-started/')
            .waitForElementVisible('[data-reactroot]', this.waitTime)

            .waitForElementVisible('#ValidateanAddresstab', this.waitTime)
            .click('#ValidateanAddresstab')
            .getText('#ValidateanAddress .console-output-header+.code-snippet-plaintext', function(req) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(req.value, 'https://development.avalara.net/1.0/address/validate');
                /* eslint-enable no-invalid-this */
            })

            .click('#ValidateanAddress .fill-sample-data')
            .getText('#ValidateanAddress .console-req-container .code-snippet', function(req) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(req.value, 'curl -X GET "https://development.avalara.net/1.0/address/validate?Line1=400 Broad St&City=Seattle&Region=WA&PostalCode=98109" -H "Accept: application/json" -H "Authorization: "');
                /* eslint-enable no-invalid-this */
            })

            .click('#ValidateanAddress .submit')
            .waitForElementVisible('#ValidateanAddress .console-res-container .code-snippet span:first-of-type', this.waitTime)
            .getText('#ValidateanAddress .console-res-container .code-snippet', function(res) {
                /* eslint-disable no-invalid-this */
                const response = JSON.parse(res.value);

                this.assert.equal(JSON.stringify(response), JSON.stringify(expectedResponseValidateAnAddress));
                /* eslint-enable no-invalid-this */
            })
            .end();
    },
    'Get Started: AvaTax (CalculateTax, fill sample data)': function(browser) {
        const expectedRequestCalcTax = {
            CustomerCode: 'ABC4335',
            Addresses: [
                {
                    AddressCode: '01',
                    Line1: '45 Fremont Street',
                    City: 'Chicago',
                    Region: 'IL',
                    Country: 'US',
                    PostalCode: '60602'
                }
            ],
            Lines: [
                {
                    LineNo: '1',
                    DestinationCode: '01',
                    OriginCode: '02',
                    Qty: '1',
                    Amount: '10'
                }
            ]
        };
        const expectedResponseCalcTax = {
            ResultCode: 'Success',
            TotalAmount: '10',
            TotalDiscount: '0',
            TotalExemption: '0',
            TotalTaxable: '10',
            TotalTax: '1.04',
            TotalTaxCalculated: '1.04',
            TaxLines: [
                {
                    LineNo: '1',
                    TaxCode: 'P0000000',
                    Taxability: 'true',
                    BoundaryLevel: 'Zip5',
                    Exemption: '0',
                    Discount: '0',
                    Taxable: '10',
                    Rate: '0.102500',
                    Tax: '1.04',
                    TaxCalculated: '1.04',
                    TaxDetails: [
                        {
                            Country: 'US',
                            Region: 'IL',
                            JurisType: 'State',
                            JurisCode: '17',
                            Taxable: '10',
                            Rate: '0.062500',
                            Tax: '0.63',
                            JurisName: 'ILLINOIS',
                            TaxName: 'IL STATE TAX'
                        },
                        {
                            Country: 'US',
                            Region: 'IL',
                            JurisType: 'County',
                            JurisCode: '031',
                            Taxable: '10',
                            Rate: '0.017500',
                            Tax: '0.18',
                            JurisName: 'COOK',
                            TaxName: 'IL COUNTY TAX'
                        },
                        {
                            Country: 'US',
                            Region: 'IL',
                            JurisType: 'City',
                            JurisCode: '14000',
                            Taxable: '10',
                            Rate: '0.012500',
                            Tax: '0.13',
                            JurisName: 'CHICAGO',
                            TaxName: 'IL CITY TAX'
                        },
                        {
                            Country: 'US',
                            Region: 'IL',
                            JurisType: 'Special',
                            JurisCode: 'AQOF',
                            Taxable: '10',
                            Rate: '0.010000',
                            Tax: '0.1',
                            JurisName: 'REGIONAL TRANSPORT. AUTHORITY (RTA)',
                            TaxName: 'IL SPECIAL TAX'
                        }
                    ]
                }
            ],
            TaxAddresses: [
                {
                    Address: '45 Fremont Street',
                    AddressCode: '01',
                    City: 'Chicago',
                    Country: 'US',
                    PostalCode: '60602',
                    Region: 'IL',
                    TaxRegionId: '2126535',
                    JurisCode: '1703114000'
                }
            ],
            TaxDate: '2016-08-30'
        };

        browser
            .maximizeWindow()
            .url(this.baseURL + '/avatax/get-started/')
            .waitForElementVisible('[data-reactroot]', this.waitTime)

            .waitForElementVisible('#CalculateTaxtab', this.waitTime)
            .click('#CalculateTaxtab')
            .getText('#CalculateTax .console-output-header+.code-snippet-plaintext', function(req) {
                /* eslint-disable no-invalid-this */
                this.assert.equal(req.value, 'https://development.avalara.net/1.0/tax/get');
                /* eslint-enable no-invalid-this */
            })

            .click('#CalculateTax .fill-sample-data')
            .getText('#CalculateTax .console-req-container .code-snippet', function(req) {
                /* eslint-disable no-invalid-this */
                const request = JSON.parse(req.value);

                this.assert.equal(JSON.stringify(request), JSON.stringify(expectedRequestCalcTax));
                /* eslint-enable no-invalid-this */
            })

            .click('#CalculateTax .submit')
            .waitForElementVisible('#CalculateTax .console-res-container .code-snippet span:first-of-type', this.waitTime)
            .getText('#CalculateTax .console-res-container .code-snippet', function(res) {
                /* eslint-disable no-invalid-this */
                const response = JSON.parse(res.value);

                response.DocCode = undefined;
                response.DocDate = undefined;
                response.Timestamp = undefined;
                response.TaxDate = undefined;
                expectedResponseCalcTax.TaxDate = undefined;
                this.assert.equal(JSON.stringify(response), JSON.stringify(expectedResponseCalcTax));
                /* eslint-enable no-invalid-this */
            })
            .end();
    }
};
