document.getElementById("submit").onclick = function (method,path,body) {
    // Just ignore this
    event.preventDefault();
    // Get the secret


    const secret = document.getElementById("secret").value;
    if (!secret) {
        alert('请输入密钥');
        return;
    }


    // ajax (send request to the server)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/fetchData');
    xhr.onreadystatechange = ()=> {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById("info-container").innerHTML = xhr.responseText;
                // 请在这里补充你的代码
            } else {
                document.getElementById("info-container").innerHTML = xhr.responseText// Error occurred
                // 请在这里补充你的代码
            }
        }
    };

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({secret}));
};

class Promise{
    constructor(fn) {
        this.callbacks = [];
        this.errorProcessors = [];
        let val,cnt;
        // noinspection JSAnnotator
        fn((ans) => {

            for (let i = 0; i < this.callbacks.length; i++) {
                val=ans;
                cnt = i;
                let newP = this.callbacks[i](val);
                if (newP && newP.then) {
                    for (let j = i + 1; j < this.callbacks.length; j++) {
                        newP.then(this.callbacks[j]);
                    }
                    break;
                }
                else {
                    val = newP;
                }
            }
        }, (err) => {
            this.errorProcessors[cnt](err);
        })
    }

    then(_callback, _errorProcessor){
        this.callbacks.push(_callback);
        this.errorProcessors.push(_errorProcessor);
        return this

    }
}


const sendRequest = (method,path,body) => {
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open(method, path);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                resolve(xhr.responseText);
                }
                else{
                    reject();
                }
            }
            xhr.send(body);
            }
    })
};



sendRequest('POST', 'http://localhost:3000/fetchData', JSON.stringify({document.getElementById("secret").value))
    .then(txt=>{document.getElementById("info-container").innerHTML=txt});

