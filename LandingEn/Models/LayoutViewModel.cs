namespace LandingEn.Models;

public class LayoutViewModel
{
    public string Language { get; set; } = "vi";

    public string TitleSeparator { get; set; } = " - ";

    public string MetaDescription { get; set; } = "";

    public NavigationData Navigation { get; set; } = new();
}

public class NavigationData
{
    public string AriaLabel { get; set; } = "";

    public string ToggleAriaLabel { get; set; } = "";

    public IReadOnlyList<NavigationLinkData> Links { get; set; } = [];

    public NavigationCtaData Cta { get; set; } = new();
}

public class NavigationLinkData
{
    public string Text { get; set; } = "";

    public string Href { get; set; } = "";
}

public class NavigationCtaData
{
    public string Text { get; set; } = "";

    public string Href { get; set; } = "";

    public bool OpensTestModal { get; set; }
}
