namespace LandingEn.Models;

public class HomePageViewModel
{
    public HomePageData Home { get; set; } = new();

    public ContactInfoViewModel Contact { get; set; } = new();

    public BaseInfoViewModel BaseInfo { get; set; } = new();
}

public class HomePageData
{
    public string Title { get; set; } = "";

    public HeroSectionData Hero { get; set; } = new();

    public ImageTextSectionData Intro { get; set; } = new();

    public IReadOnlyList<StatItemData> Stats { get; set; } = [];

    public FeatureSectionData Why { get; set; } = new();

    public CoursePreviewSectionData Courses { get; set; } = new();

    public RoadmapSectionData Roadmap { get; set; } = new();

    public TeachersSectionData Teachers { get; set; } = new();

    public MottoSectionData Motto { get; set; } = new();

    public GallerySectionData Gallery { get; set; } = new();

    public VideoSectionData Videos { get; set; } = new();

    public TestimonialsSectionData Testimonials { get; set; } = new();

    public NewsSectionData News { get; set; } = new();

    public ContactHomeSectionData ContactSection { get; set; } = new();

    public FooterSectionData Footer { get; set; } = new();
}

public class HeroSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Lead { get; set; } = "";

    public string BackgroundImageUrl { get; set; } = "";

    public string PrimaryActionText { get; set; } = "";

    public string PrimaryActionHref { get; set; } = "";

    public string SecondaryActionText { get; set; } = "";

    public string SecondaryActionHref { get; set; } = "";
}

public class ImageTextSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<string> Paragraphs { get; set; } = [];

    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";

    public string LinkText { get; set; } = "";

    public string LinkHref { get; set; } = "";
}

public class StatItemData
{
    public string Value { get; set; } = "";

    public string Label { get; set; } = "";
}

public class FeatureSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<FeatureItemData> Items { get; set; } = [];
}

public class FeatureItemData
{
    public string Number { get; set; } = "";

    public string Title { get; set; } = "";

    public string Text { get; set; } = "";
}

public class CoursePreviewSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<ImageCardData> Items { get; set; } = [];
}

public class ImageCardData
{
    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";

    public string Title { get; set; } = "";

    public string Text { get; set; } = "";

    public string LinkText { get; set; } = "";

    public string LinkHref { get; set; } = "";
}

public class RoadmapSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Text { get; set; } = "";

    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";

    public IReadOnlyList<RoadmapLevelData> Levels { get; set; } = [];
}

public class RoadmapLevelData
{
    public string Number { get; set; } = "";

    public string Title { get; set; } = "";

    public string Text { get; set; } = "";
}

public class TeachersSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Text { get; set; } = "";

    public IReadOnlyList<ImageTitleData> Items { get; set; } = [];
}

public class ImageTitleData
{
    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";

    public string Title { get; set; } = "";
}

public class MottoSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Text { get; set; } = "";

    public string Quote { get; set; } = "";

    public string Cite { get; set; } = "";
}

public class GallerySectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<GalleryItemData> Items { get; set; } = [];
}

public class GalleryItemData
{
    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";

    public string Caption { get; set; } = "";
}

public class VideoSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Text { get; set; } = "";

    public IReadOnlyList<string> Items { get; set; } = [];
}

public class TestimonialsSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<TestimonialItemData> Items { get; set; } = [];
}

public class TestimonialItemData
{
    public string Stars { get; set; } = "";

    public string Text { get; set; } = "";

    public string Name { get; set; } = "";
}

public class NewsSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public IReadOnlyList<NewsItemData> Items { get; set; } = [];
}

public class NewsItemData
{
    public string Date { get; set; } = "";

    public string Title { get; set; } = "";

    public string Text { get; set; } = "";

    public string ImageUrl { get; set; } = "";

    public string ImageAlt { get; set; } = "";
}

public class ContactHomeSectionData
{
    public string Eyebrow { get; set; } = "";

    public string Heading { get; set; } = "";

    public string Text { get; set; } = "";

    public string ButtonText { get; set; } = "";
}

public class FooterSectionData
{
    public string Description { get; set; } = "";

    public string PhoneLabel { get; set; } = "";

    public string AddressesHeading { get; set; } = "";

    public string Copyright { get; set; } = "";

    public IReadOnlyList<FooterLinkGroupData> LinkGroups { get; set; } = [];
}

public class FooterLinkGroupData
{
    public string Heading { get; set; } = "";

    public IReadOnlyList<FooterLinkData> Links { get; set; } = [];
}

public class FooterLinkData
{
    public string Text { get; set; } = "";

    public string Href { get; set; } = "";
}
