GSON
=============

Serialize circular javascript object graphs,
using [circularjs](https://github.com/aaaristo/circularjs) to
traverse them in a non-recusive way.

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

## Huge graph serialization

When you have graphs of some million nodes it may be necessary
to hand-off serialization to somenthing out of the V8 heap,
for this reason i've written [gsonpp](https://github.com/aaaristo/gsonpp).
