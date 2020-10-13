using Website.Models;
using Website.Services;

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Website.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class WebsiteController : ControllerBase {
		private readonly WebsiteService _webService;

		public WebsiteController(WebsiteService websiteService) {
			_webService = websiteService;
		}

		[HttpGet]
		public ActionResult<List<Devotional>> Get() => _webService.Get();
	}
}