namespace LandingEn.Models;

public class ContactInfoViewModel
{
    public string DetailsHeading { get; set; } = "";

    public string PhoneLabel { get; set; } = "";

    public string EmailLabel { get; set; } = "";

    public string MessengerLabel { get; set; } = "";

    public string FacebookLabel { get; set; } = "";

    public string QrCaption { get; set; } = "";

    public string PopupQrCaption { get; set; } = "";

    public string OpenStatus { get; set; } = "";

    public string OpenTimeText { get; set; } = "";

    public string Intro { get; set; } = "";

    public IReadOnlyList<string> Addresses { get; set; } = [];
}
