'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const coverageDetailsLimitDirectory = path.join(__dirname, '../data/coveragedetails/coverageLimit');
const coverageDetailsOptionDirectory = path.join(__dirname, '../data/coveragedetails/coverageOption');
const coverageDetailsDeductibleDirectory = path.join(__dirname, '../data/coveragedetails/deductible');

const updateCoverageDetail = (context, coverageDetails) => {
    const { companyCode, state, product, version, name, type } = coverageDetails;

    return updateRecord(context, 'coveragedetails',
        {
            companyCode, state, product, version: moment(version).toDate(), name, type
        },
        {
            ...coverageDetails,
            version: moment(version).toDate()
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
