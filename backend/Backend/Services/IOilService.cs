using Backend.Entities;
using System;
using System.Collections.Generic;
using System.ServiceModel;

namespace Backend.Services
{
    [ServiceContract]
    public interface IOilService: IBaseResourceService
    {
        [OperationContract]
        public List<Oil> All();

        [OperationContract]
        public List<Oil> GetDateRange(DateTime startDate, DateTime endDate);
    }
}
