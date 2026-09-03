using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using LandingEn.Models;

namespace LandingEn.Controllers;

public class HomeController : Controller
{
    private readonly IWebHostEnvironment _environment;

    public HomeController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Courses()
    {
        var coursesPath = Path.Combine(_environment.ContentRootPath, "Data", "courses.json");
        var courses = ReadCourses(coursesPath);

        return View(courses);
    }

    private static IReadOnlyList<CourseViewModel> ReadCourses(string path)
    {
        if (!System.IO.File.Exists(path))
        {
            return [];
        }

        var json = System.IO.File.ReadAllText(path);
        return JsonSerializer.Deserialize<IReadOnlyList<CourseViewModel>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? [];
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
