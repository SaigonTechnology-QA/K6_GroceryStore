import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { scenario } from 'k6/execution';
import http from 'k6/http';
import { check } from 'k6';

// Init
export let options = {
    scenarios: {
        full_test: {
            executor: "per-vu-iterations", // 4 * 5 = 20 iterations
            vus: 4,
            iterations: 5},
    },
    ext: {
        loadimpact: {
            projectID: 3639542,
            name: "Full_Test_Run"}}
}

// Prepare test data
const csvData = new SharedArray('AuthData', function () {
    return papaparse.parse(open('./AccountData.csv'), { header: true }).data;
});

// VU script
export default function () {
    const user = csvData[scenario.iterationInTest];
    let payload = {"clientName": `${user.clientName}`, "clientEmail": `${user.clientEmail}`}
    let params = {headers: {"Content-Type": "application/json"}};

    // Get Access Token
    let res = http.post('https://simple-grocery-store-api.glitch.me/api-clients', JSON.stringify(payload), params);
    check(res, {'Res status is 201': r => r.status === 201});
    let accessTokenStr = JSON.parse(res.body).accessToken;

    // Get All Orders
    params = {headers: {"Authorization": "Bearer " + `${accessTokenStr}`}};
    res = http.get('https://simple-grocery-store-api.glitch.me/orders', params);
    check(res, {'Res status is 200': r => r.status === 200});
}
