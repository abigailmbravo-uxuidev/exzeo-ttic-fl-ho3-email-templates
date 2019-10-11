'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const coverageDetailsLimitDirectory = path.join(__dirname, '../data/coveragedetails/coverageLimit');
const coverageDetailsOptionDirectory = path.join(__dirname, '../data/coveragedetails/coverageOption');
const coverageDetailsDeductibleDirectory = path.join(__dirname, '../data/coveragedetails/deductible');

const updateCoverageDetail = (context, coverageDetails) => {
    const { companyCode, state, product, effectiveDate, type } = coverageDetails;

    return updateRecord(context, 'coveragedetails',
        {
            companyCode, state, product, effectiveDate: moment(effectiveDate).toDate(), name, type
        },
        {
            ...coverageDetails,
            effectiveDate: moment(effectiveDate).toDate()
        }
    );
};

const updateCoverageDetails = async context => {
    const coverageDetailsLimitFiles = await  getFiles(context, coverageDetailsLimitDirectory);
    const coverageDetailsOptionFiles = await  getFiles(context, coverageDetailsOptionDirectory);
    const coverageDetailsDeductibleFiles = await  getFiles(context, coverageDetailsDeductibleDirectory);
    return context.taskPool.forEach(context, updateCoverageDetails.name,
        coverageDetailsLimitFiles.concat(coverageDetailsOptionFiles).concat(coverageDetailsDeductibleFiles),
        async ruleFile => updateCoverageDetail(context, await ruleFile.load())
    );
};

module.exports = { updateCoverageDetails };
