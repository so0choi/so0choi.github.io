---
title: cloudwatch log insights query sdk
description: 'javascript sdk를 사용해 cloudwatch log insight를 사용하는 법을 정리한다. 코드 참고 Stackoverflow'
pubDate: 2022-12-19 11:18:56
tags:

---


javascript sdk를 사용해 cloudwatch log insight를 사용하는 법을 정리한다.

## 코드

```js
var AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-2',credentials: {
    accessKeyId: "",
    secretAccessKey: "",
}, });

// Create CloudWatch service object
var cl = new AWS.CloudWatchLogs();

const params = {
    startTime: new Date(2022,10,16,0,0,0).getTime(),/* required */
    endTime: new Date(2022,10,17,0,0,0).getTime() /* required */ ,
    logGroupName: '' /* required */ ,
    queryString: `` /* query문 작성 */
}

cl.startQuery(params,  (err, data) => {
    if(err) {
        console.log(err, err.stack);
    } else {
        const {queryId} = data;
        cl.getQueryResults({queryId}, (_err, _data) => {
            if (_err ) {
                console.log(_err, _err.stack);
            } else {
                console.log(_data)
            }
        })
         getResults(data)
    }

})

const getResults = (data) => {
    cl.getQueryResults({
        queryId: data.queryId
    }, (_err, _data) => {
        if (_err) {
            console.log(_err, _err.stack)
        }
        else {
            if (_data.results) {
                // do something
            }

            /*check the status and run the function again*/
            if (_data.status.toLowerCase() === 'running') {
                getResults(data)
            }
        }
    })
}


```

## 참고

- [Stackoverflow](https://stackoverflow.com/questions/71235333/is-there-any-method-in-aws-sdk-for-javascript-to-get-the-aws-log-insights-query)