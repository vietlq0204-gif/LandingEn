using System.Net;
using System.Net.Mail;
using System.Text;
using LandingEn.Models;
using Microsoft.Extensions.Options;

namespace LandingEn.Services;

public class SmtpTestRegistrationEmailSender : ITestRegistrationEmailSender
{
    private readonly SmtpOptions _options;

    public SmtpTestRegistrationEmailSender(IOptions<SmtpOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendAsync(TestRegistrationRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.Host) || string.IsNullOrWhiteSpace(_options.AdminEmail))
        {
            throw new InvalidOperationException("SMTP is not configured.");
        }

        var fromEmail = string.IsNullOrWhiteSpace(_options.FromEmail) ? _options.UserName : _options.FromEmail;
        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("SMTP from email is not configured.");
        }

        using var message = new MailMessage
        {
            From = new MailAddress(fromEmail, _options.FromName),
            Subject = "Đăng ký test trình độ mới",
            Body = BuildBody(request),
            BodyEncoding = Encoding.UTF8,
            SubjectEncoding = Encoding.UTF8,
            IsBodyHtml = false
        };

        message.To.Add(_options.AdminEmail);
        message.ReplyToList.Add(new MailAddress(fromEmail, _options.FromName));

        using var smtpClient = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.EnableSsl
        };

        if (!string.IsNullOrWhiteSpace(_options.UserName))
        {
            smtpClient.Credentials = new NetworkCredential(_options.UserName, _options.Password);
        }

        cancellationToken.ThrowIfCancellationRequested();
        await smtpClient.SendMailAsync(message);
    }

    private static string BuildBody(TestRegistrationRequest request)
    {
        var phone = string.Join(" ", new[] { request.CountryCode, request.Phone }.Where(value => !string.IsNullOrWhiteSpace(value)));

        return $"""
               Có học viên đăng ký test trình độ tiếng anh miễn phí.

               Họ tên: {request.FullName}
               Số điện thoại: {phone}
               Cơ sở muốn học: {request.Location}
               Nhu cầu học: {request.Need}

               Thời gian gửi: {DateTimeOffset.Now:dd/MM/yyyy HH:mm:ss zzz}
               """;
    }
}
