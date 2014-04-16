GSON
=============

Serialize circular javascript object graphs,
using [circularjs](https://github.com/aaaristo/circularjs) to
traverse them.

```
npm install gson
```

```javascript

var GSON= require('gson');

var a= { name: 'Andrea' },
    e= { name: 'Elena' };
    
a.daughter= e;
e.dad= a;

console.log(GSON.decode(GSON.encode(a)));
console.log(GSON.parse(GSON.stringify(a)));
```
