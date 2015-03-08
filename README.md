# series

Execute a processor function on an array of items in series.

## Usage

```javascript
series([1, 2, 3], function(n, cb) {
  console.log(n);
  cb();
},function(err) {
  console.log('done');
});
```

### Error handling

You may throw an error or pass a truthy value to the callback to terminate the series.  That value will be passed to the final callback.