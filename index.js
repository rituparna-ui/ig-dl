const express = require('express');
const url = require('url');
const URL = require('url').URL;
const app = express();
const axios = require('axios').default;

const bigint = require('big-integer');
const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = lower.toUpperCase();
const numbers = '0123456789';
const ig_alphabet = upper + lower + numbers + '-_';
const bigint_alphabet = numbers + lower;

function fromShortcode(shortcode) {
  const o = shortcode.replace(/\S/g, (m) => {
    const c = ig_alphabet.indexOf(m);
    const b = bigint_alphabet.charAt(c);
    return b != '' ? b : `<${c}>`;
  });
  return bigint(o, 64).toString(10);
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res, next) => {
  res.render('home', {
    data: [],
    media_type: 0,
    caption: '',
  });
});

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

app.post('/', async (req, res, next) => {
  const valid = stringIsAValidUrl(req.body.url);
  if (!valid) {
    return res.send('Invalid URL');
  }
  const parsed = url.parse(req.body.url);
  shortcode = parsed.pathname.split('/')[2];
  const id = fromShortcode(shortcode);
  const fetchUrl = `https://i.instagram.com/api/v1/media/${id}/info/`;
  let response = {};
  try {
    response = await axios.get(fetchUrl, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-asbd-id': '198387',
        'x-csrftoken': 'e6GT6JXm580x0UM61bGYhlB34l8FjV0Z',
        'x-ig-app-id': '936619743392459',
        'x-ig-www-claim':
          'hmac.AR2rCmfN1Jb98fTtIV5rXy1EHz-DxQIGk6fgEQbmFdZp0uiw',
        cookie:
          'mid=YqthTQAEAAHu0dKwRMrlPIzMZ6wg; ig_did=580855A5-D746-4CC2-8A1C-956DCAA75C0E; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken=e6GT6JXm580x0UM61bGYhlB34l8FjV0Z; ds_user_id=4274094922; sessionid=4274094922%3AJzEununglmTvbT%3A23; shbid="17689\\0544274094922\\0541687350355:01f785e9fb5d825f1ce6b0a4db219be50627b0caec47841f6307031ccbfec4478e936ae0"; shbts="1655814355\\0544274094922\\0541687350355:01f7f006e2d870a204a59d23d577bcfc33b1f008b7834954d41f51ab615d4a14ea9e4036"; datr=27ixYmhbbZzUzGg5IzWt7vVp; fbsr_124024574287414=_f9z74Jj4hbQdzbpHoHcrhXPnbyL014wLqnk2Ctfc0E.eyJ1c2VyX2lkIjoiMTAwMDAzMDkxMzYxODk1IiwiY29kZSI6IkFRQlhQMVQybnVQSmV6R29ZdTNQNlBON3B2UGtMUllNTGotcndXYXhFT3dFWVJaU0t1Z3lPc0FtUlYtZHhKbFV3MjVNdUZSc1lKVlNsaXpjdkVEVlEzcUloVms3NF80dWlSUi1VZkxwZXI1LXhWbC1lcTdfeUdWS1M2Um5NMnFMNEpGel9xNnZfR2hILXgxV2FnNGVxUWhRampOTlNPcGNWbm5XS0duYmU1Qi1icXVfcm9odXVYSXZCTjRLMkxCMGVleWt1eWZaN3ZtQUtpTnd6aHI3QjlSNldPdnd5SU5TVlBxdWRiSEdKZE9XVWhjdGpxOXFvbWMtdTExRk5UYTgyTWZWZ2VZWENzMmVsQUtYZWNOWDZvbmRRRWw4eWM3N3VhQWZBbGZQdlNNTzVHeU92QWdYUWRuN051bEgtcnJVaXdUcXRleDBqcnlod1VUdGpQc3h1Tkh1Iiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUptVW83Y3hZUXdZWGI5Y0owMjdUY1MxYjVRVm05bDZmZlJyVTRaQTN4WUM5ZTMwZkNSeGdxeHJCMXhKeWdIbXpxaE14NVlaQ2EyVjdGQkt1aHZYWXRaQmkyeVpCeHNyM2Q5YTEwWkJRZFRGa25yOUIxOGRRMGk2aHhBd0lOaUt2a1hUTnFDSm5HTjc2SjlvWXlxVmNaQXZaQWVyc2c5RW5LNXIxY1RxZWs0Yk82STRLMGI5d0FaRCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjU2MDU3OTM2fQ; rur="ODN\\0544274094922\\0541687593990:01f7207ee49d736fde67602ad41f69b466cdfc5352e173d089945358fad6b17f2a5232c5"',
        Referer: 'https://www.instagram.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  } catch (error) {
    return res.send('Internal Server Error');
  }

  // media type 1 => single photo
  if (response.data.items[0].media_type == 1) {
    const uris = response.data.items[0].image_versions2.candidates;
    const key = 'width';
    const arrayUniqueByKey = [
      ...new Map(uris.map((item) => [item[key], item])).values(),
    ];

    return res.render('home', {
      data: arrayUniqueByKey,
      media_type: 1,
      caption:
        response.data.items[0].caption.text.substring(0, 10) || 'untitled',
    });
    // res.send(arrayUniqueByKey);
  }

  // media type 2 => single video / igtv / reel
  if (response.data.items[0].media_type == 2) {
    const uris = response.data.items[0].video_versions;
    const key = 'width';
    const arrayUniqueByKey = [
      ...new Map(uris.map((item) => [item[key], item])).values(),
    ];
    return res.render('home', {
      data: arrayUniqueByKey,
      media_type: 1,
      caption:
        response.data.items[0].caption.text.substring(0, 10) || 'untitled',
    });
  }

  // media type 8 => album
  if (response.data.items[0].media_type == 8) {
    const uris = response.data.items[0].carousel_media;
    const carousel = uris.map((x) => {
      // check if photo or video
      if (x.media_type == 1) {
        // image
        return {
          type: 'img',
          url: x.image_versions2.candidates[0].url,
        };
      }
      if (x.media_type == 2) {
        // video
        return {
          type: 'vid',
          url: x.video_versions[0].url,
        };
      }
    });
    return res.render('home', {
      data: carousel,
      media_type: 8,
      caption: '',
    });
  }
  res.send('Bad Request');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);
