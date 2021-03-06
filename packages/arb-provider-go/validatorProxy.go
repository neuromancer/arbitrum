package goarbitrum

import (
	"bytes"
	"context"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/evm"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/message"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/rpc/json"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"

	"github.com/offchainlabs/arbitrum/packages/arb-util/value"
)

type ValidatorProxy interface {
	GetMessageResult(ctx context.Context, txHash []byte) (*evm.TxInfo, error)
	GetAssertionCount(ctx context.Context) (int, error)
	GetVMInfo(ctx context.Context) (string, error)
	FindLogs(ctx context.Context, fromHeight, toHeight *uint64, addresses []common.Address, topics [][]common.Hash) ([]evm.FullLog, error)
	CallMessage(ctx context.Context, msg message.Call, sender common.Address) (value.Value, error)
	PendingCall(ctx context.Context, msg message.Call, sender common.Address) (value.Value, error)
}

type ValidatorProxyImpl struct {
	url string
}

func NewValidatorProxyImpl(url string) ValidatorProxy {
	if url == "" {
		url = "http://localhost:1235"
	}
	return &ValidatorProxyImpl{url}
}

func _encodeInt(i *uint64) string {
	if i == nil {
		return ""
	}

	return "0x" + strconv.FormatUint(*i, 16)
}

func _encodeByteArraySlice(slice []common.Hash) []string {
	ret := make([]string, len(slice))
	for i, arr := range slice {
		ret[i] = hexutil.Encode(arr[:])
	}
	return ret
}

func _encodeAddressArraySlice(slice []common.Address) []string {
	ret := make([]string, len(slice))
	for i, arr := range slice {
		ret[i] = hexutil.Encode(arr[:])
	}
	return ret
}

func (vp *ValidatorProxyImpl) doCall(ctx context.Context, methodName string, request interface{}, response interface{}) error {
	msg, err := json.EncodeClientRequest("Validator."+methodName, request)
	if err != nil {
		log.Println("ValProxy.doCall: error in json.Enc:", err)
		return err
	}
	req, err := http.NewRequest("POST", vp.url, bytes.NewBuffer(msg))
	if err != nil {
		return err
	}
	req = req.WithContext(ctx)
	req.Header.Set("Content-Type", "application/json")
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		log.Println("doCall error:", err)
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	ret := json.DecodeClientResponse(resp.Body, response)
	if ret != nil {
		log.Println("ValProxy.doCall: error in json.Dec from", methodName, ":", ret)
	}
	return ret
}

//
//func (vp *ValidatorProxyImpl) SendMessage(val value.Value, hexPubkey string, signature []byte) ([]byte, error) {
//	var buf bytes.Buffer
//	if err := value.MarshalValue(val, &buf); err != nil {
//		log.Println("ValProxy.SendMessage: marshaling error:", err)
//		return nil, err
//	}
//	request := &rollupvalidator.SendMessageArgs{
//		Data:      hexutil.Encode(buf.Bytes()),
//		Pubkey:    hexPubkey,
//		Signature: hexutil.Encode(signature),
//	}
//	var response rollupvalidator.SendMessageReply
//	if err := vp.doCall("SendMessage", request, &response); err != nil {
//		log.Println("ValProxy.SendMessage: error returned from doCall:", err)
//		return nil, err
//	}
//	bs, err := hexutil.Decode(response.TxHash)
//	if err != nil {
//		log.Println("ValProxy.SendMessage error:", err)
//	}
//	return bs, err
//}

func (vp *ValidatorProxyImpl) GetMessageResult(ctx context.Context, txHash []byte) (*evm.TxInfo, error) {
	request := &evm.GetMessageResultArgs{
		TxHash: hexutil.Encode(txHash),
	}
	var response evm.GetMessageResultReply
	if err := vp.doCall(ctx, "GetMessageResult", request, &response); err != nil {
		log.Println("ValProxy.GetMessageResult: doCall returned error:", err)
		return nil, err
	}
	return response.Tx.Unmarshal()
}

func (vp *ValidatorProxyImpl) GetAssertionCount(ctx context.Context) (int, error) {
	request := &struct{}{}
	var response evm.GetAssertionCountReply
	if err := vp.doCall(ctx, "GetAssertionCount", request, &response); err != nil {
		return 0, err
	}
	return int(response.AssertionCount), nil
}

func (vp *ValidatorProxyImpl) GetVMInfo(ctx context.Context) (string, error) {
	request := &struct{}{}
	var response evm.GetVMInfoReply
	if err := vp.doCall(ctx, "GetVMInfo", request, &response); err != nil {
		return "", err
	}
	return response.VmID, nil
}

func (vp *ValidatorProxyImpl) FindLogs(ctx context.Context, fromHeight, toHeight *uint64, addresses []common.Address, topicGroups [][]common.Hash) ([]evm.FullLog, error) {
	tgs := make([]*evm.TopicGroup, 0, len(topicGroups))
	for _, topicGroup := range topicGroups {
		tgs = append(tgs, &evm.TopicGroup{Topics: _encodeByteArraySlice(topicGroup)})
	}
	request := &evm.FindLogsArgs{
		FromHeight:  _encodeInt(fromHeight),
		ToHeight:    _encodeInt(toHeight),
		Addresses:   _encodeAddressArraySlice(addresses),
		TopicGroups: tgs,
	}
	var response evm.FindLogsReply
	if err := vp.doCall(ctx, "FindLogs", request, &response); err != nil {
		return nil, err
	}

	logs := make([]evm.FullLog, 0, len(response.Logs))
	for _, l := range response.Logs {
		parsedLog, err := l.Unmarshal()
		if err != nil {
			return nil, err
		}
		logs = append(logs, parsedLog)
	}
	return logs, nil
}

func hexToValue(rawVal string) (value.Value, error) {
	retBuf, err := hexutil.Decode(rawVal)
	if err != nil {
		return nil, err
	}
	return value.UnmarshalValue(bytes.NewReader(retBuf))
}

func (vp *ValidatorProxyImpl) CallMessage(ctx context.Context, msg message.Call, sender common.Address) (value.Value, error) {
	request := &evm.CallMessageArgs{
		Data:   hexutil.Encode(msg.AsData()),
		Sender: hexutil.Encode(sender[:]),
	}
	var response evm.CallMessageReply
	if err := vp.doCall(ctx, "CallMessage", request, &response); err != nil {
		return nil, err
	}
	return hexToValue(response.RawVal)
}

func (vp *ValidatorProxyImpl) PendingCall(ctx context.Context, msg message.Call, sender common.Address) (value.Value, error) {
	request := &evm.CallMessageArgs{
		Data:   hexutil.Encode(msg.AsData()),
		Sender: hexutil.Encode(sender[:]),
	}
	var response evm.CallMessageReply
	if err := vp.doCall(ctx, "PendingCall", request, &response); err != nil {
		return nil, err
	}
	return hexToValue(response.RawVal)
}
