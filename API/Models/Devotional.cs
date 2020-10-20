using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace DevoAPI.Models {
	public class Devotional {
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		public string DevoName { get; set; }
		public string Author { get; set; }
		public string AuthorTitle { get; set; }
		public DateTime Date { get; set; }
		public string Campus { get; set; }
		public Uri URI { get; set; }
		public Uri MP3_URI { get; set; }
		public Uri Video_URI { get; set; }
	}
}