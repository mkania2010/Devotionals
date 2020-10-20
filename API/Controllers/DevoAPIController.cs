using DevoAPI.Models;
using DevoAPI.Services;

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace DevoAPI.Controllers {
	[ApiController]
	public class DevoAPIController : ControllerBase {
		private readonly DevoAPIService _devoAPIService;

		public DevoAPIController(DevoAPIService devoAPIService) {
			_devoAPIService = devoAPIService;
		}

		// Default route - return all
		[HttpGet]
		[Route("api/devotionals")]
		public ActionResult<List<Devotional>> Get() => _devoAPIService.Get();



		// Non-default - return devotionals from specified year
		[HttpGet("{year:length(4)}", Name = "GetDevotional")]
		[Route("api/devotionals/{year:datetime}")]
		public ActionResult<List<Devotional>> Get(DateTime year) {
			// Create a list of devotionals from the database
			var tempDevotionals = _devoAPIService.Get();
			// Create an empty list to be returned
			List<Devotional> devotionals = new List<Devotional>();

			foreach (Devotional devo in tempDevotionals) {
				DateTime tempYear = devo.Date;

				if (tempYear.Year == year.Year)
					devotionals.Add(devo);
			}

			// If array is empty, return a not found error, else return the array
			if (devotionals.Count == 0)
				return NotFound();
			else 
				return Ok(devotionals);
		}
	}
}