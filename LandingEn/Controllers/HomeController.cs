using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using LandingEn.Models;

namespace LandingEn.Controllers;

public class HomeController : Controller
{
    private readonly IWebHostEnvironment _environment;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public HomeController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public IActionResult Index()
    {
        var sharedData = SetSharedViewData();

        return View(new HomePageViewModel
        {
            Home = ReadJsonFile<HomePageData>("home.json", sharedData.BaseInfo) ?? new HomePageData(),
            Contact = sharedData.ContactInfo,
            BaseInfo = sharedData.BaseInfo
        });
    }

    public IActionResult Privacy()
    {
        SetSharedViewData();

        return View();
    }

    public IActionResult Courses()
    {
        SetSharedViewData();
        var courses = ReadJsonFile<IReadOnlyList<CourseViewModel>>("courses.json") ?? [];

        return View(courses);
    }

    private T? ReadJsonFile<T>(string fileName, BaseInfoViewModel? baseInfo = null)
    {
        var path = Path.Combine(_environment.ContentRootPath, "Data", fileName);

        if (!System.IO.File.Exists(path))
        {
            return default;
        }

        var json = System.IO.File.ReadAllText(path);
        if (baseInfo is not null)
        {
            json = ApplyBaseInfoTokens(json, baseInfo);
        }

        return JsonSerializer.Deserialize<T>(json, JsonOptions);
    }

    private ContactInfoViewModel ReadContactInfo(BaseInfoViewModel baseInfo)
    {
        return ReadJsonFile<ContactInfoViewModel>("contact.json", baseInfo) ?? new ContactInfoViewModel();
    }

    private BaseInfoViewModel ReadBaseInfo()
    {
        return ReadJsonFile<BaseInfoViewModel>("baseInfo.json") ?? new BaseInfoViewModel();
    }

    private LayoutViewModel ReadLayoutData(BaseInfoViewModel baseInfo)
    {
        return ReadJsonFile<LayoutViewModel>("layout.json", baseInfo) ?? new LayoutViewModel();
    }

    private (ContactInfoViewModel ContactInfo, BaseInfoViewModel BaseInfo) SetSharedViewData()
    {
        var baseInfo = ReadBaseInfo();
        var contactInfo = ReadContactInfo(baseInfo);
        ViewData["ContactInfo"] = contactInfo;
        ViewData["BaseInfo"] = baseInfo;
        ViewData["LayoutData"] = ReadLayoutData(baseInfo);

        return (contactInfo, baseInfo);
    }

    private static string ApplyBaseInfoTokens(string value, BaseInfoViewModel baseInfo)
    {
        return value
            .Replace("{brandName}", baseInfo.BrandName)
            .Replace("{category}", baseInfo.Category)
            .Replace("{phoneNumber}", baseInfo.PhoneNumber)
            .Replace("{phoneDisplay}", baseInfo.PhoneDisplay)
            .Replace("{email}", baseInfo.Email)
            .Replace("{homeUrl}", baseInfo.Urls.Home)
            .Replace("{coursesUrl}", baseInfo.Urls.Courses)
            .Replace("{websiteUrl}", baseInfo.Urls.Website)
            .Replace("{zaloUrl}", baseInfo.Urls.Zalo)
            .Replace("{messengerUrl}", baseInfo.Urls.Messenger)
            .Replace("{facebookUrl}", baseInfo.Urls.Facebook);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        SetSharedViewData();

        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
