var MongoClient = require('mongodb').MongoClient,
	setting = require("../setting.js"),
	client;
console.log("MongoDB connecting...");
exports.save = function(collectionName, obj, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.insert(obj, {
				safe: true
			}, callback);
		});
	});
};

exports.findOne = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.findOne(oArgs, callback);
		});
	});
};

exports.update = function(collectionName, oArgs, newObj, callback) {
	if (newObj._id) delete newObj._id;
	MongoClient.connect(setting.host, function(err, client) {
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
	});

};

exports.remove = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.remove(oArgs, function(err, result) {
				callback(err);
			});
		});
	});
};

exports.count = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.count(oArgs, callback);
		});
	});
};

exports.find = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			var tmp,
				skip;
			if (err) return callback(err);
			tmp = collection.find(oArgs.condition);
			if (oArgs.sort) tmp.sort(oArgs.sort);
			if (oArgs.page) {
				skip = oArgs.page.curPage * oArgs.page.perPage;
				tmp.limit(oArgs.page.perPage).skip(skip);
			}
			tmp.toArray(callback);
		});
	});
};