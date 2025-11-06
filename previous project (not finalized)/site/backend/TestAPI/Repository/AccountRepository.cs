using Microsoft.EntityFrameworkCore;
using TestAPI.Data;
using TestAPI.Models;

namespace TestAPI.Repository
{
    /*
    public class AccountRepository(AppDbContext _appDbContext)
    {
        
        public async Task CreateAccountAsync(AccountEntity account)
        {
            await _appDbContext.AddAsync(account);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<AccountEntity> ReadAccountAsync(int id)
        {
            try
            {
                var acc = await _appDbContext.Accounts.FirstAsync(x => x.Id == id);
                return acc;
            }
            catch (Exception)
            {
                throw new Exception("Account not found");
            }
        }

        public async Task<List<AccountEntity>> ReadAllAccountsAsync()
        {
            return await _appDbContext.Accounts.ToListAsync();
        }

        
        public async Task<AccountEntity> UpdateAccountAsync(int id, string name, string password)
        {
            var acc = await ReadAccountAsync(id);
            
            acc.Name = name;
            acc.Password = password;

            await _appDbContext.SaveChangesAsync();
            return acc;
        }
        

        public async Task DeleteAccountAsync(int id)
        {
            var acc = await ReadAccountAsync(id);
            _appDbContext.Accounts.Remove(acc);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteAllAccountsAsync()
        {
            await _appDbContext.Accounts.ExecuteDeleteAsync();
        }
        
    }   */
}
