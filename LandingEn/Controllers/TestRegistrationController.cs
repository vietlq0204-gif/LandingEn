using LandingEn.Models;
using LandingEn.Services;
using Microsoft.AspNetCore.Mvc;

namespace LandingEn.Controllers;

[ApiController]
[Route("api/test-registration")]
public class TestRegistrationController : ControllerBase
{
    private readonly ITestRegistrationEmailSender _emailSender;
    private readonly ILogger<TestRegistrationController> _logger;

    public TestRegistrationController(
        ITestRegistrationEmailSender emailSender,
        ILogger<TestRegistrationController> logger)
    {
        _emailSender = emailSender;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create(TestRegistrationRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _emailSender.SendAsync(request, cancellationToken);
            return Ok(new { success = true });
        }
        catch (InvalidOperationException exception)
        {
            _logger.LogWarning(exception, "Test registration email is not configured.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "Email service is not configured." });
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to send test registration email.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Could not send registration email." });
        }
    }
}
