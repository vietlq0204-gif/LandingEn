namespace LandingEn.Models;

public class BaseInfoViewModel
{
    public string BrandName { get; set; } = "";

    public string Category { get; set; } = "";

    public string PhoneNumber { get; set; } = "";

    public string PhoneDisplay { get; set; } = "";

    public string Email { get; set; } = "";

    public IReadOnlyList<string> PreconnectUrls { get; set; } = [];

    public BaseUrlsData Urls { get; set; } = new();

    public BaseLogosData Logos { get; set; } = new();

    public BaseQrData Qr { get; set; } = new();
}

public class BaseUrlsData
{
    public string Home { get; set; } = "/";

    public string Courses { get; set; } = "/Home/Courses";

    public string Website { get; set; } = "";

    public string Zalo { get; set; } = "";

    public string Messenger { get; set; } = "";

    public string Facebook { get; set; } = "";
}

public class BaseLogosData
{
    public MediaAssetData Page { get; set; } = new();

    public MediaAssetData Footer { get; set; } = new();

    public MediaAssetData Avatar { get; set; } = new();

    public MediaAssetData Zalo { get; set; } = new();

    public MediaAssetData Messenger { get; set; } = new();

    public MediaAssetData Facebook { get; set; } = new();

    public MediaAssetData ZaloPhone { get; set; } = new();
}

public class BaseQrData
{
    public MediaAssetData Zalo { get; set; } = new();
}

public class MediaAssetData
{
    public string ImageUrl { get; set; } = "";

    public string Alt { get; set; } = "";
}
