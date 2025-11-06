using TestAPI.Models;
using TestAPI.Models.DTO;

namespace TestAPI.Services
{
    public interface IAuthService
    {
        Task<User> Register(RegisterDto registerDto);
        Task<string> Login(LoginDto loginDto);
        Task<User> GetCurrentUser(int userId);
    }
}
