using DevoAPI.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace DevoAPI.Services {
	public class DevoAPIService {
		private readonly IMongoCollection<Devotional> _devotionals;

		public DevoAPIService(IDatabaseSettings settings) {
			var client = new MongoClient(settings.ConnectionString);
			var database = client.GetDatabase(settings.DatabaseName);

			_devotionals = database.GetCollection<Devotional>(settings.CollectionName);
		}

		public List<Devotional> Get() => _devotionals.Find(Devotional => true).ToList();
	}
}