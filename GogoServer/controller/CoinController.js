const CoinPlanDao = require('../dao/CoinPlanDao');

const formatPlan = (plan) => {
    delete plan.delete_ts;
    delete plan.create_ts;
};

const getPlans = (req, res) => {
    Co(function *() {
        const plans = yield CoinPlanDao.getPlans();
        for (let plan of plans) {
            formatPlan(plan);
        }
        BaseRes.success(res, plans);
    })
};

module.exports = {
    getPlans
};