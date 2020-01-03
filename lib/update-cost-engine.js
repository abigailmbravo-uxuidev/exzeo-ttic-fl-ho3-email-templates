'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const costEngineEquationsDirectory = path.join(__dirname, '../data/costengine/costengineequations');
const costEngineSelectDirectory = path.join(__dirname, '../data/costengine/costengineselect');
const costFactorAdjustmentsDirectory = path.join(__dirname, '../data/costengine/costfactoradjustments');
const costFactorDeductiblesDirectory = path.join(__dirname, '../data/costengine/costfactordeductibles');
const costFactorsDirectory = path.join(__dirname, '../data/costengine/costfactors');

const updateCostEngineEquation = (context, equations) => {
    const { companyCode, state, product, version } = equations;

    return updateRecord(context, 'costengineequations',
        {
            companyCode, state, product, version
        },
        {
            ...equations
        }
    );
};

const updateCostEngineEquations = async context => {
    const costEngineEquationFiles = await  getFiles(context, costEngineEquationsDirectory);
    return context.taskPool.forEach(context, updateCostEngineEquations.name,
        costEngineEquationFiles,
        async ruleFile => updateCostEngineEquation(context, await ruleFile.load())
    );
};

const updateCostEngineSelect = (context, costEngines) => {
  const { companyCode, state, product, version } = costEngines;

  return updateRecord(context, 'costengineselect',
      {
          companyCode, state, product, version
      },
      {
          ...costEngines
      }
  );
};

const updateCostEngineSelections = async context => {
  const costEngineSelectionFiles = await  getFiles(context, costEngineSelectDirectory);
  return context.taskPool.forEach(context, updateCostEngineSelections.name,
      costEngineSelectionFiles,
      async ruleFile => updateCostEngineSelect(context, await ruleFile.load())
  );
};

const updateCostFactorAdjustment = (context, factorAdjustments) => {
  const { companyCode, state, product, version, factor, factorParameter } = factorAdjustments;

  return updateRecord(context, 'costfactoradjustments',
      {
          companyCode, state, product, version, factor, factorParameter
      },
      {
          ...factorAdjustments
      }
  );
};

const updateCostFactorAdjustments = async context => {
  const costFactorAdjustmentsFiles = await  getFiles(context, costFactorAdjustmentsDirectory);
  return context.taskPool.forEach(context, updateCostFactorAdjustments.name,
      costFactorAdjustmentsFiles,
      async ruleFile => updateCostFactorAdjustment(context, await ruleFile.load())
  );
};

const updateCostFactorDeductible = (context, factorDeductibles) => {
  const { companyCode, state, product, version, countyName, aopDeductible, replacementCost } = factorDeductibles;

  return updateRecord(context, 'costfactordeductibles',
      {
          companyCode, state, product, version, countyName, aopDeductible, replacementCost
      },
      {
          ...factorDeductibles
      }
  );
};

const updateCostFactorDeductibles = async context => {
  const costFactorDeductiblesFiles = await  getFiles(context, costFactorDeductiblesDirectory);
  return context.taskPool.forEach(context, updateCostFactorDeductibles.name,
      costFactorDeductiblesFiles,
      async ruleFile => updateCostFactorDeductible(context, await ruleFile.load())
  );
};

const updateCostFactor = (context, costFactors) => {
  const { companyCode, state, product, version, countyName, zip } = costFactors;

  return updateRecord(context, 'costfactors',
      {
          companyCode, state, product, version, countyName, zip
      },
      {
          ...costFactors
      }
  );
};

const updateCostFactors = async context => {
  const costFactorsFiles = await  getFiles(context, costFactorsDirectory);
  return context.taskPool.forEach(context, updateCostFactors.name,
      costFactorsFiles,
      async ruleFile => updateCostFactor(context, await ruleFile.load())
  );
};

module.exports = {
  updateCostEngineEquations,
  updateCostEngineSelections,
  updateCostFactorAdjustments,
  updateCostFactorDeductibles,
  updateCostFactors
};
