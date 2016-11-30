/*global app, jasmine, describe, it, beforeEach, expect */

describe('model', function () {
  'use strict';

  var model;
  var store;

  // map -> array
  var objToMap = function (obj) {
    var o = obj;
    return Object.keys(obj).map(function(key) {
      var todoObj = o[key];
      return objWithId(todoObj, key);
    });
  };

  var objWithId = function (id, todo) {
    var res = todo;
    res.id = id;
    return res;
  }

  /* Test double for Store */
  var setupStorage = function (data) {
    var todos = data;
    var totalId = data.length || 0;
    store.find.and.callFake(function (query, callback) {
      if (query.id !== undefined) {
        callback([objWithId(query.id, todos[query.id])]); // get by id
      } else {
        callback([]);
      }
    });

    store.findAll.and.callFake(function (callback) {
      callback(objToMap(todos));
    });

    store.save.and.callFake(function (updateData, callback, id) {
      if (id) {
        todos[id] = updateData;
        callback([objWithId(id, updateData)]);
      } else {
        var createdId = totalId;
        todos[totalId] = updateData;
        totalId++;
        callback([objWithId(createdId, updateData)]);
      }
    });

    store.remove.and.callFake(function (id, callback) {
      delete todos[id];
      callback(objToMap(todos));
    });

    store.drop.and.callFake(function (callback) {
      // return empty data
      callback([]);
    });
  };

  beforeEach(function () {
		store = jasmine.createSpyObj('store', ['find', 'findAll', 'save', 'remove', 'drop']);
    console.log(app);
    model = new app.Model(store);
  });

  it('creates new todo models', function () {
    setupStorage([]);
    var expected = [{
      id: 0,
      title: 'my todo title',
      completed: false
    }];
    var callback = function (newData) {
      expect(newData[0]).toEqual(expected[0]);
    }

    model.create('my todo title', callback);
  });

  it('reads a model from storage by id', function () {

  });

  it('updates a model in storage', function () {

  });

  it('removes a model by id', function () {

  });

  it('removes all data from storage', function () {

  });

  it('returns count of all todos', function () {

  });
});
