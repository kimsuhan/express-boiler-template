import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import date from 'date-and-time';

import config from './config/config.js';
import morgan from './config/morgan.js';
import ApiError from './errors/ApiError.js';
import { errorConverter, errorHandler } from './middlewares/error.js';

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

/**
 *************************
 * Security HTTP headers
 *************************
 * csp(-) : Content-Security-Policy 헤더 설정 / XSS(Cross-site scripting) 공격 및 기타 교차 사이트 인젝션 예방.
 * hidePowerdBy : X-Powered-By 헤더 제거
 * hpkp(-) : Public Key Pinning 헤더 추가. 위조된 인증서를 이용한 중간자 공격 방지.
 * hsts : SSL/TLS를 통한 HTTP 연결을 적용하는 Strict-Transport-Security 헤더 설정.
 * noCache(-) : Cache-Control 및 Pragma 헤더를 설정하여 클라이언트 측에서 캐싱을 사용하지 않도록 함.
 * frameguard : X-Frame-Options 헤더 설정하여 clickjacking에 대한 보호 제공
 * ieNoOpen : (IE8 이상) X-Download-Options 설정.
 * xssFilter : X-XSS-Protection 설정. 대부분의 최신 웹 브라우저에서 XSS(Cross-site scripting) 필터를 사용.
 * noSniff : X-Content-Type-Options 설정하여, 선언된 콘텐츠 유형으로부터 벗어난 응답에 대한 브라우저의 MIME 가로채기를 방지.
 */
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Server Status Checking Api
app.get('/', (req, res) => {
    const now = new Date();
    res.status(httpStatus.OK).send({ message: 'Server is Detected', date: date.format(now, 'YYYY-MM-DD HH:mm:ss') });
});

// 404 Error
app.use(() => {
    throw new ApiError(httpStatus.NOT_FOUND, '404 Not Found');
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
