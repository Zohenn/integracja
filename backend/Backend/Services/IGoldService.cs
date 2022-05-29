using Backend.Entities;
using System;
using System.Collections.Generic;
using System.ServiceModel;

namespace Backend.Services
{
    [ServiceContract]
    public interface IGoldService: IBaseResourceService
    {
        [OperationContract]
        public List<Gold> All();

        [OperationContract]
        public List<Gold> GetDateRange(DateTime startDate, DateTime endDate);
    }
}
