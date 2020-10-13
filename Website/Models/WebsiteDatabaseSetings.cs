namespace Website.Models {
	public class WebsiteDatabaseSettings : IWebsiteDatabaseSettings {
		public string WebsiteCollectionName { get; set; }
		public string ConnectionString { get; set; }
		public string DatabaseName { get; set; }
	}

	public interface IWebsiteDatabaseSettings {
		string WebsiteCollectionName { get; set; }
		string ConnectionString { get; set; }
		string DatabaseName { get; set; }
	}
}