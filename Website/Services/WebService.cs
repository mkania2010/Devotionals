using Website.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace Website.Services {
	public class WebsiteService {
		private readonly IMongoCollection<Devotional> _devotionals;

		public WebsiteService(IWebsiteDatabaseSettings settings) {
			var client = new MongoClient(settings.ConnectionString);
			var database = client.GetDatabase(settings.DatabaseName);

			_devotionals = database.GetCollection<Devotional>(settings.WebsiteCollectionName);
		}

		public List<Devotional> Get() => _devotionals.Find(Devotional => true).ToList();
	}
}