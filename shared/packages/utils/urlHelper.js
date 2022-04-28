import _get from 'lodash/get';

export const handleUrl = (url, lang = null) => {
  if (url) {
    if (url === 'https://env.hdbank.com.vn/searchs.html') {
      return url;
    }
    // let urlArr = url.split('/');
    // return urlArr.join('/');
    let urlArr = url.split("/");
    if (["vi", "en", "jp"].includes(urlArr[1])) {
      urlArr[1] = lang;
    }
    else {
      urlArr.splice(1, 0, lang);
    }
    // console.log({ link: urlArr.join("/").replace('//', '/') });
    let joinUrl = urlArr.join("/");
    return joinUrl.replace('//', '/');
  }
  return url;
};

export const serialize = (href, obj) => {
  var str = [];
  if (href) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    if (href.indexOf('?') === -1) {
      return `${href}?${str.join('&')}`;
    }
    return `${href}&${str.join('&')}`;
  } else return '';
};

export function removeURLParameter(url, parameter) {
  const urlparts = url.split('?');
  if (urlparts.length >= 2) {
    return urlparts[0];
  }
  return url;
}

export function getPathname() {
  if (typeof window !== 'undefined') {
    const pathname = _get(window, 'location.pathname');
    if (pathname) {
      try {
        return pathname.split('/').filter(Boolean);
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
  return null;
}
