var commonDao = require("../DAO/CommonDAO.js"),
	collectionName = "tag",
	uuid = require("node-uuid"),
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) return callback(err);
			for (i = results.length; i--;) {
				results[i] = new Tag(results[i]);
			}
			callback(err, results);

		};
	};

function Tag(tag) {
	this.name = tag.name;
	this.createTime = tag.createTime;
	this.id = tag.id;
	this.color = tag.color;
}

module.exports = Tag;

Tag.prototype.save = function(callback) {
	commonDao.save(collectionName, {
		name: this.name,
		color : this.color,
		createTime: new Date().getTime(),
		id: uuid.v4()
	}, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return new Error("保存标签失败");
		return callback(err, new Tag(result[0]));
	});
};

Tag.get = function(id, callback) {
	commonDao.findOne(collectionName, {
		id: id
	}, function(err, result) {
		if (err) return callback(err);
		callback(err, result ? new Tag(result) : result);
	});
};

Tag.getAll = function(callback) {
	commonDao.find(collectionName, {
		sort: {
			createTime: -1
		}
	}, __resultToListFn(callback));
};

Tag.getByFuzzyName = function(name, callback) {
	commonDao.find(collectionName, {
		condition: {
			name: new RegExp(name)
		},
		sort: {
			createTime: -1
		}
	}, __resultToListFn(callback));
};