import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

// Init
export let options = {
  scenarios: {
    ramping_vus_scenario: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        {target: 5, duration: "20s" },
        {target: 0, duration: "5s" }
      ]
    },
  },
  ext: {
    loadimpact: {
        projectID: 3639542,
        name: "Full_Test_Run"}}
}

// VU script
export default function () {
  const req1 = {
    method: 'GET',
    url: 'https://simple-grocery-store-api.glitch.me/products',
  };
  const req2 = {
    method: 'GET',
    url: 'https://simple-grocery-store-api.glitch.me/products/4643',
  };
  const responses = http.batch([req1, req2]);
  check(responses[0], {
    'Res status is 200': r => r.status === 200
  });
  check(responses[1], {
    'Res status is 200': r => r.status === 200,
    'Category is coffee': r => (JSON.parse(r.body)).category === 'coffee',
  });
  // sleep(1);
}
