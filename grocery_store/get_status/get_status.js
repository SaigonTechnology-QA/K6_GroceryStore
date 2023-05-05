import http from 'k6/http';
import { check } from 'k6';

// init
export let options = {
    vus: 2,
    duration: '10s',
}

// vu script
export default function () {
  let res = http.get('https://simple-grocery-store-api.glitch.me/status');
  check(res, {
    'Res status is 200': r => r.status === 200,
    'System status is UP': r => (JSON.parse(r.body)).status === 'UP',
  });
}
