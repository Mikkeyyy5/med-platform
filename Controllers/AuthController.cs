using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestAPI.Data;
using TestAPI.Models;
using TestAPI.Repository;

namespace TestAPI.Controllers
{// Controllers/AuthController.cs
    using System.Security.Claims;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using TestAPI.Models.DTO;
    using TestAPI.Services;

    // Controllers/AuthController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private MedicalDbContext _context;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                var user = await _authService.Register(registerDto);
                var token = await _authService.Login(new LoginDto
                {
                    Email = registerDto.Email,
                    Password = registerDto.Password
                });

                return Ok(new { token, user = new { user.Id, user.FirstName, user.LastName, user.Email } });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var token = await _authService.Login(loginDto);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                return Ok(new { token, user = new { user.Id, user.FirstName, user.LastName, user.Email } });
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _authService.GetCurrentUser(userId);

            return Ok(new { user.Id, user.FirstName, user.LastName, user.Email, user.Phone, user.City, user.Address });
        }
    }
}
