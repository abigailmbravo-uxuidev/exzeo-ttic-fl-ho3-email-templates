'use strict';

const { expect } = require('chai');
const { generateEmailMessage, getAllEmailTemplatesFromDB, getAllEmailTemplatesFromFiles, getAllEmailTestTemplatesFromFiles, parseHtmlBody } = require('../test-contract/support/util');

context('runs all email template tests', () => {
  let requestBody = {};
  beforeEach(() => {
    requestBody = {
      fromName: 'testFromName',
      fromEmail: 'testFromEmail@typtap.com',
      subject: 'testSubject',
      body: 'testBody',
      toEmail: ['testToEmail@hcpci.com'],
      toName: 'testToName',
      bccEmail: ['testBccEmail@hcpci.com'],
      ccEmail: ['testCcEmail@hcpci.com'],
      variables: [
        {
          key: 'TO_NAME',
          value: 'TestToName'
        },
        {
          key: 'FROM_NAME',
          value: 'TestFromName'
        },
        {
          key: 'FROM_EMAIL',
          value: 'testFromEmail@hcpci.com'
        },
        {
          key: 'QUOTENUMBER',
          value: 'TestQuoteNumber'
        },
        {
          key: 'POLICYNUMBER',
          value: 'TestPolicyNumber'
        },
        {
          key: 'SITEURL',
          value: 'TestSiteUrl.hcpci.com'
        },
        {
          key: 'SITEURLHO3',
          value: 'TestSiteUrlHO3.hcpci.com'
        },
        {
          key: 'SITEURLAF3',
          value: 'TestSiteUrlAF3.hcpci.com'
        },
        {
          key: 'AGENCYNAME',
          value: 'TestAgencyName'
        },
        {
          key: 'AGENCY_NAME',
          value: 'TestAgencyName2'
        },
        {
          key: 'AGENT_FIRST_NAME',
          value: 'TestAgentFirstName'
        },
        {
          key: 'AGENT_LAST_NAME',
          value: 'TestAgentLastName'
        },
        {
          key: 'AGENT_PHONE',
          value: 'TestAgentPhone'
        },
        {
          key: 'AGENCYPHONENUMBER',
          value: 'TestAgencyPhoneNumber'
        },
        {
          key: 'AGENCYEMAILADDRESS',
          value: 'TestAgencyEmailAddress@hcpci.com'
        },
        {
          key: 'AGENCY_EMAIL_ADDRESS',
          value: 'TestAgencyEmailAddress2@hcpci.com'
        },
        {
          key: 'POLICY_NUMBER',
          value: 'TestPolicyNumber2'
        },
        {
          key: 'QUOTE_NUMBER',
          value: 'TestQuoteNumber2'
        },
        {
          key: 'POLICYHOLDER1_FIRSTNAME',
          value: 'TestPolicyHolderFirstName'
        },
        {
          key: 'POLICYHOLDER1_LASTNAME',
          value: 'TestPolicyHolderLastName'
        }
      ],
      companyCode: 'TTIC',
      state: 'FL',
    }
  });

  describe('uses database for templates and returns email message from email-service', () => {
    it('validates data was applied appropriately to email templates', async () => {
      const templates = await getAllEmailTemplatesFromDB();

      for (const template of templates) {
        requestBody.product = template.product;
        const response = await generateEmailMessage({
          ...requestBody,
          templateName: template.name
        });

        expect(response, 'an error occured with a non-200 status').to.have.property('data');
        expect(response.data.status).to.equal(200);

        const newBody = parseHtmlBody(requestBody, template.body);
        expect(response.data.result.htmlBody).to.equal(newBody);
      }
    });
  });

  describe('uses local templated html files and returns email message from email-service', () => {
    it('validates data was applied appropriately to email templates', async () => {
      const templates = await getAllEmailTemplatesFromFiles();

      for (const template of templates) {
        requestBody.product = template.product;
        const response = await generateEmailMessage({
          ...requestBody,
          templateName: template.name
        });

        expect(response, 'an error occured with a non-200 status').to.have.property('data');
        expect(response.data.status).to.equal(200);

        const newBody = parseHtmlBody(requestBody, template.body);
        expect(response.data.result.htmlBody).to.equal(newBody);
      }
    });
  });

  describe('uses local untemplated html files and returns email message from email-service', () => {
    it('validates data was applied appropriately to email templates', async () => {
      const templates = await getAllEmailTestTemplatesFromFiles();

      for (const template of templates) {
        requestBody.product = template.product;
        const response = await generateEmailMessage({
          ...requestBody,
          templateName: template.name
        });

        expect(response, 'an error occured with a non-200 status').to.have.property('data');
        expect(response.data.status).to.equal(200);
        expect(response.data.result.htmlBody).to.equal(template.body);
      }
    });
  })
});