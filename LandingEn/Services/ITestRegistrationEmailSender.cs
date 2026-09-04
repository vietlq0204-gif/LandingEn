using LandingEn.Models;

namespace LandingEn.Services;

public interface ITestRegistrationEmailSender
{
    Task SendAsync(TestRegistrationRequest request, CancellationToken cancellationToken);
}
