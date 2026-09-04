using System.ComponentModel.DataAnnotations;

namespace LandingEn.Models;

public class TestRegistrationRequest
{
    [Required]
    public string FullName { get; set; } = "";

    [Required]
    public string Phone { get; set; } = "";

    public string CountryCode { get; set; } = "";

    [Required]
    public string Location { get; set; } = "";

    [Required]
    public string Need { get; set; } = "";
}
