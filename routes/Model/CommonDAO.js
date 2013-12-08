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
			}, function(err, result) {
				callback(err, result);
				client.close();
			});
		});
	});
};

exports.findOne = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.findOne(oArgs, function(err, result) {
				callback(err, result);
				client.close();
			});
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
				function(err, result) {
					callback(err, result);
					client.close();
				});
		});
	});

};

exports.remove = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.remove(oArgs, function(err, result) {
				callback(err, result);
				client.close();
			});
		});
	});
};

exports.count = function(collectionName, oArgs, callback) {
	MongoClient.connect(setting.host, function(err, client) {
		client.collection(collectionName, function(err, collection) {
			if (err) return callback(err);
			collection.count(oArgs, function(err, result) {
				callback(err, result);
				client.close();
			});
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
			tmp.toArray(function(err, result) {
				callback(err, result);
				client.close();
			});
		});
	});
};