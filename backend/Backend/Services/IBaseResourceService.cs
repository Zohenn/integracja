using Backend.Models;
using System.ServiceModel;

namespace Backend.Services
{
    [ServiceContract]
    public interface IBaseResourceService
    {
        [OperationContract]
        public ResourceInfo Info();
    }
}
