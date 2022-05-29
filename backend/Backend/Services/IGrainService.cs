using Backend.Entities;
using System;
using System.Collections.Generic;
using System.ServiceModel;

namespace Backend.Services
{
    [ServiceContract]
    public interface IGrainService: IBaseResourceService
    {
        [OperationContract]
        public List<Grain> All();

        [OperationContract]
        public List<Grain> GetDateRange(DateTime startDate, DateTime endDate);
    }
}
