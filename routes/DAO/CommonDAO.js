var MongoClient = require('mongodb').MongoClient,
	setting = require("../setting.js"),
	client;
console.log("MongoDB connecting...");
MongoClient.connect(setting.host, function(err, db) {
	console.log("MongoDB connected...");
	client = db;
});


exports.save = function(collectionName, obj, callback) {
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		collection.insert(obj, {
			safe: true
		}, callback);
	});
};

exports.find = function(collectionName, oArgs, sortFields, callback) {
	if (typeof callback !== "function" && typeof sortFields === "function") {
		callback = sortFields;
		sortFields = null;
	}
	client.collection(collectionName, function(err, collection) {
		var tmp;
		if (err) return callback(err);
		tmp = collection.find(oArgs);
		if (sortFields) tmp = tmp.sort(sortFields);
		tmp.toArray(callback);
	});
};

exports.findOne = function(collectionName, oArgs, callback) {
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		collection.findOne(oArgs, callback);
	});
};


exports.findByPage = function(collectionName, oArgs, curPage, perPage, sortFields, callback) {
	if (typeof callback !== "function" && typeof sortFields === "function") {
		callback = sortFields;
		sortFields = null;
	}
	var skip = curPage * perPage;
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		tmp = collection.find(oArgs).limit(perPage).skip(skip);
		if (sortFields) tmp = tmp.sort(sortFields);
		tmp.toArray(callback);
	});
};

exports.update = function(collectionName, oArgs, newObj, callback) {
	if (newObj._id) delete newObj._id;
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		collection.update(oArgs, {
				$set: newObj
			}, {
				safe: true,
				upsert: false,
				multi: true
			},
			callback);
	});
};

exports.remove = function(collectionName, oArgs, callback) {
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		collection.remove(oArgs, callback);
	});
};

exports.count = function(collectionName, oArgs, callback) {
	client.collection(collectionName, function(err, collection) {
		if (err) return callback(err);
		collection.count(oArgs, callback);
	});
};